import React from 'react';
import { HelpPanel } from '@awsui/components-react';

const header = <h2>Meeting Details</h2>;
const content = <p>View meeting details and transcriptions.</p>;

const ToolsPanel = () => <HelpPanel header={header}>{content}</HelpPanel>;

export default ToolsPanel;
