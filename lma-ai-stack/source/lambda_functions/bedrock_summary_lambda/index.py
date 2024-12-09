# Invokes Anthropic generate text API using requests module
# see https://console.anthropic.com/docs/api/reference for more details

import os
import json
import re
import boto3

# grab environment variables
BEDROCK_MODEL_ID = os.environ["BEDROCK_MODEL_ID"]
FETCH_TRANSCRIPT_LAMBDA_ARN = os.environ["FETCH_TRANSCRIPT_LAMBDA_ARN"]
PROCESS_TRANSCRIPT = os.getenv("PROCESS_TRANSCRIPT", "False") == "True"
TOKEN_COUNT = int(os.getenv("TOKEN_COUNT", "0"))  # default 0 - do not truncate.
S3_BUCKET_NAME = os.environ["S3_BUCKET_NAME"]
S3_PREFIX = os.environ["S3_PREFIX"]


# for local dev
# ------------------------------------------------------------------------------------------------------------------------------------------------------
# BEDROCK_MODEL_ID = "anthropic.claude-3-haiku-20240307-v1:0"
# FETCH_TRANSCRIPT_LAMBDA_ARN = "arn:aws:lambda:us-east-1:553602933418:function:LMA-PROD-AISTACK-1B6L1W3KCE7VS-FetchTranscript-S65OhgffUakk"
# PROCESS_TRANSCRIPT = True
# TOKEN_COUNT = 0
# S3_BUCKET_NAME = "lma-prod-recordingsbucket-ekq93oq43iwp"
# S3_PREFIX = "lma-transcripts/"
# LLM_PROMPT_TEMPLATE_TABLE_NAME = (
#     "LMA-PROD-LLMTEMPLATESTACK-CFN7HW821N9R-LLMPromptTemplateTable-1PFAJM276Z0EU"
# )
# ------------------------------------------------------------------------------------------------------------------------------------------------------

LLM_USER_TABLE_NAME = "LMA04-UsersTable"
# Table name and keys used for default and custom prompt templates items in DDB
LLM_PROMPT_TEMPLATE_TABLE_NAME = os.environ["LLM_PROMPT_TEMPLATE_TABLE_NAME"]
DEFAULT_PROMPT_TEMPLATES_PK = "DefaultSummaryPromptTemplates"
CUSTOM_PROMPT_TEMPLATES_PK = "CustomSummaryPromptTemplates"

# Optional environment variables allow region / endpoint override for bedrock Boto3
BEDROCK_REGION = (
    os.environ["BEDROCK_REGION_OVERRIDE"]
    if "BEDROCK_REGION_OVERRIDE" in os.environ
    else os.environ["AWS_REGION"]
)
BEDROCK_ENDPOINT_URL = os.environ.get(
    "BEDROCK_ENDPOINT_URL", f"https://bedrock-runtime.{BEDROCK_REGION}.amazonaws.com"
)


lambda_client = boto3.client("lambda")
dynamodb_client = boto3.client("dynamodb")
bedrock = boto3.client(
    service_name="bedrock-runtime", region_name=BEDROCK_REGION, endpoint_url=BEDROCK_ENDPOINT_URL
)


def get_department_value(response):
    try:
        # Navigate through the dictionary safely
        item = response.get("Item", {})
        department = item.get("department", {})
        department_list = department.get("L", [])

        # Ensure the list has at least one element
        if department_list and isinstance(department_list[0], dict):
            return department_list[0].get("S", None)

        # Return None if the value is not found
        return None
    except (AttributeError, IndexError, KeyError, TypeError) as e:
        return None


def get_user_role_value(response):
    try:
        # Navigate through the dictionary safely
        item = response.get("Item", {})
        role = item.get("role", {})
        return role.get("S", None)
    except (AttributeError, IndexError, KeyError, TypeError) as e:
        return None


def get_user_department_role(owner):
    ownerPromptConfigResponse = dynamodb_client.get_item(
        Key={"PK": {"S": owner}},
        TableName=LLM_USER_TABLE_NAME,
    )

    department = get_department_value(ownerPromptConfigResponse)
    if department is None:
        return None

    role = get_user_role_value(ownerPromptConfigResponse)
    if role is None:
        return None

    PROMPT_TEMPLATES_PK = department + "." + role + "." + "DefaultSummaryPromptTemplates"
    promptTemplatesResponse = dynamodb_client.get_item(
        Key={"LLMPromptTemplateId": {"S": PROMPT_TEMPLATES_PK}},
        TableName=LLM_PROMPT_TEMPLATE_TABLE_NAME,
    )

    if promptTemplatesResponse is None:
        return None
    return promptTemplatesResponse["Item"]


def get_templates_from_dynamodb(prompt_override, metadata):
    owner = metadata["Owner"]
    templates = []
    prompt_template_str = None

    if prompt_override is not None:
        prompt_template_str = prompt_override
        try:
            prompt_templates = json.loads(prompt_template_str)
            for k, v in prompt_templates.items():
                prompt = v.replace("<br>", "\n")
                templates.append({k: prompt})
        except:
            prompt = prompt_template_str.replace("<br>", "\n")
            templates.append({"Summary": prompt})

    if prompt_template_str is None:
        try:
            defaultPromptTemplatesResponse = dynamodb_client.get_item(
                Key={"LLMPromptTemplateId": {"S": DEFAULT_PROMPT_TEMPLATES_PK}},
                TableName=LLM_PROMPT_TEMPLATE_TABLE_NAME,
            )
            customPromptTemplatesResponse = dynamodb_client.get_item(
                Key={"LLMPromptTemplateId": {"S": CUSTOM_PROMPT_TEMPLATES_PK}},
                TableName=LLM_PROMPT_TEMPLATE_TABLE_NAME,
            )

            defaultPromptTemplates = defaultPromptTemplatesResponse["Item"]
            customPromptTemplates = customPromptTemplatesResponse["Item"]

            mergedPromptTemplates = {**defaultPromptTemplates, **customPromptTemplates}

            userMetadataBaseDefaultPromptTemplates = get_user_department_role(owner)
            if userMetadataBaseDefaultPromptTemplates is not None:
                mergedPromptTemplates = {
                    **mergedPromptTemplates,
                    **userMetadataBaseDefaultPromptTemplates,
                }

            for k in sorted(mergedPromptTemplates):
                if k != "LLMPromptTemplateId" and k != "*Information*":
                    prompt = mergedPromptTemplates[k]["S"]
                    # skip if prompt value is empty, or set to 'NONE'
                    if prompt and prompt != "NONE":
                        prompt = prompt.replace("<br>", "\n")
                        index = k.find("#")
                        k_stripped = k[index + 1 :]
                        templates.append({k_stripped: prompt})
        except Exception as e:
            print("Exception:", e)
            raise (e)
    return templates


def get_transcripts(callId):
    payload = {
        "CallId": callId,
        "ProcessTranscript": PROCESS_TRANSCRIPT,
        "TokenCount": TOKEN_COUNT,
        "IncludeSpeaker": True,
    }
    response = lambda_client.invoke(
        FunctionName=FETCH_TRANSCRIPT_LAMBDA_ARN,
        InvocationType="RequestResponse",
        Payload=json.dumps(payload),
    )
    transcript_data = response["Payload"].read().decode()
    transcript_json = json.loads(transcript_data)
    return transcript_json


def get_request_body(modelId, prompt, max_tokens, temperature):
    provider = modelId.split(".")[0]
    request_body = None
    if provider == "anthropic":
        # claude-3 models use new messages format
        if modelId.startswith("anthropic.claude-3"):
            request_body = {
                "anthropic_version": "bedrock-2023-05-31",
                "messages": [{"role": "user", "content": [{"type": "text", "text": prompt}]}],
                "max_tokens": max_tokens,
                "temperature": temperature,
            }
        else:
            request_body = {
                "prompt": prompt,
                "max_tokens_to_sample": max_tokens,
                "temperature": temperature,
            }
    else:
        raise Exception("Unsupported provider: ", provider)
    return request_body


def get_generated_text(modelId, response):
    provider = modelId.split(".")[0]
    generated_text = None
    response_body = json.loads(response.get("body").read())

    if provider == "anthropic":
        # claude-3 models use new messages format
        if modelId.startswith("anthropic.claude-3"):
            generated_text = response_body.get("content")[0].get("text")
        else:
            generated_text = response_body.get("completion")
    else:
        raise Exception("Unsupported provider: ", provider)
    return generated_text


def call_bedrock(prompt_data):
    modelId = BEDROCK_MODEL_ID
    accept = "application/json"
    contentType = "application/json"

    body = get_request_body(modelId, prompt_data, max_tokens=512, temperature=0)
    response = bedrock.invoke_model(
        body=json.dumps(body), modelId=modelId, accept=accept, contentType=contentType
    )
    generated_text = get_generated_text(modelId, response)
    return generated_text


def generate_summary(transcript, prompt_override, metadata):
    # first check to see if this is one prompt, or many prompts as a json
    templates = get_templates_from_dynamodb(prompt_override, metadata)
    result = {}
    for item in templates:
        key = list(item.keys())[0]
        prompt = item[key]
        prompt = prompt.replace("{transcript}", transcript)
        response = call_bedrock(prompt)
        result[key] = response
    if len(result.keys()) == 1:
        # there's only one summary in here, so let's return just that.
        # this may contain json or a string.
        return result[list(result.keys())[0]]
    return json.dumps(result)


def posixify_filename(filename: str) -> str:
    # Replace all invalid characters with underscores
    regex = r"[^a-zA-Z0-9_.]"
    posix_filename = re.sub(regex, "_", filename)
    # Remove leading and trailing underscores
    posix_filename = re.sub(r"^_+", "", posix_filename)
    posix_filename = re.sub(r"_+$", "", posix_filename)
    return posix_filename


def getKBMetadata(metadata):
    # Keys to include
    keys_to_include = [
        "CallId",
        "CreatedAt",
        "UpdatedAt",
        "Owner",
        "TotalConversationDurationMillis",
    ]
    # Create a new dictionary with only the specified keys
    filtered_metadata = {key: metadata[key] for key in keys_to_include if key in metadata}
    kbMetadata = {"metadataAttributes": filtered_metadata}
    return json.dumps(kbMetadata)


def format_summary(summary, metadata):
    summary_dict = json.loads(summary)
    summary_dict["MEETING NAME"] = metadata["CallId"]
    summary_dict["MEETING DATE AND TIME"] = metadata["CreatedAt"]
    summary_dict["MEETING DURATION (SECONDS)"] = int(
        metadata["TotalConversationDurationMillis"] / 1000
    )
    return json.dumps(summary_dict)


def write_to_s3(callId, metadata, transcript, summary):
    s3 = boto3.client("s3")
    filename = posixify_filename(f"{callId}")
    summary_file_key = f"{S3_PREFIX}{filename}-SUMMARY.txt"
    transcript_file_key = f"{S3_PREFIX}{filename}-TRANSCRIPT.txt"
    summary = format_summary(summary, metadata)
    kbMetadata = getKBMetadata(metadata)
    s3.put_object(Bucket=S3_BUCKET_NAME, Key=summary_file_key, Body=summary)
    s3.put_object(Bucket=S3_BUCKET_NAME, Key=f"{summary_file_key}.metadata.json", Body=kbMetadata)
    s3.put_object(Bucket=S3_BUCKET_NAME, Key=transcript_file_key, Body=transcript)
    s3.put_object(
        Bucket=S3_BUCKET_NAME, Key=f"{transcript_file_key}.metadata.json", Body=kbMetadata
    )


def handler(event, context):
    print("Received event: ", json.dumps(event))
    callId = event["CallId"]
    try:
        transcript_json = get_transcripts(callId)
        transcript = transcript_json["transcript"]
        metadata = transcript_json["metadata"]
        summary = "No summary available"
        prompt_override = None
        if "Prompt" in event:
            prompt_override = event["Prompt"]
        summary = generate_summary(transcript, prompt_override, metadata)
        if not prompt_override:
            # only write to S3 when using default summary prompt (eg not invoked via QnABot)
            write_to_s3(callId, metadata, transcript, summary)
    except Exception as e:
        summary = "An error occurred."
    return {"summary": summary}


# for testing on terminal
if __name__ == "__main__":
    event = {"CallId": "8cfc6ec4-0dbe-4959-b1f3-34f13359826b"}
    handler(event, "")
