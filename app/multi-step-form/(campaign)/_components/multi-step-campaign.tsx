"use client";

import CampaignForm from "./campaign-form";
import { CampaignProvider } from "./multi-step-campaign-config";

const MultiStepCampaign = ({projectName ,ProjectId}:{projectName :string ,ProjectId:number}) => {
	
	return (
		<CampaignProvider>
			<CampaignForm projectName={projectName} ProjectId={ProjectId} />
		</CampaignProvider>
	);
};

export default MultiStepCampaign;
