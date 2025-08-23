"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { containerCampaignForm as container } from "@/constants/framer-motion";
import { useMultiStepForm } from "@/hooks/multi-step-form";
import { motion } from "framer-motion";
import { CampaignFormContext } from "./multi-step-campaign-config";
import MultiStepNavbar from "@/components/multi-step-form/multi-step-navbar";
import { MultiStepForm } from "@/components/multi-step-form/multi-step-form";
import MultiStepNavButtons from "@/components/multi-step-form/multi-step-nav-buttons";

const CampaignForm = ({
  projectName,
  ProjectId,
}: {
  projectName: string;
  ProjectId: number;
}) => {
  const { CurrentForm } = useMultiStepForm(CampaignFormContext, ProjectId);

  return (
    <Card className="w-full max-w-4xl mx-auto border-custom-green mt-5 ">
      {/* MultiStepNavbar at the top */}
      <CardHeader className="mb-10 border-none">
        <div className="flex gap1 lg:gap-6 flex-wrap">
          <div className="flex-1">
            <h1 className="text-base font-semibold ml-6 mt-2 w-full lg:w-auto">
              {" "}
              Settings
            </h1>
          </div>
          <div className="flex-1 py-6  relative -top-7 px-2">
            <MultiStepNavbar
              ProjectId={ProjectId}
              context={CampaignFormContext}
            />
          </div>
        </div>
      </CardHeader>

      {/* MultiStepForm underneath MultiStepNavbar */}
      <CardContent className="flex flex-col ">
        <MultiStepForm ProjectId={ProjectId}>
          <div className="flex flex-col flex-1  min-w-fit ">
            <motion.div
              variants={container}
              className="flex flex-col"
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <CurrentForm />
            </motion.div>
            <MultiStepNavButtons
              ProjectId={ProjectId}
              context={CampaignFormContext}
              previousLabel="Previous"
              nextLabel="Next"
              endStepCreateLabel="Save"
              endStepUpdateLabel="Update"
            />
          </div>
        </MultiStepForm>
      </CardContent>
    </Card>
  );
};

export default CampaignForm;
