"use client";
import { containerMultiStepForm as container } from "@/constants/framer-motion";
import { useMultiStepForm } from "@/hooks/multi-step-form";
import { motion } from "framer-motion";
import { Form } from "@/components/ui/form";
import React, { PropsWithChildren } from "react";
import { CampaignFormContext,  } from "@/app/multi-step-form/(campaign)/_components/multi-step-campaign-config";
import { Card, CardContent } from "../ui/card";

interface Props extends PropsWithChildren {
  ProjectId:number
};

export const MultiStepForm = ({  children,ProjectId }: Props) => {
  const { form, onAddSubmit,onUpdateSubmit, onErrors,hasData } = useMultiStepForm(CampaignFormContext,ProjectId);
  const handleSubmit = hasData ? onUpdateSubmit : onAddSubmit;

  return (
    
    <Form {...form}>
      <form onSubmit={form?.handleSubmit(handleSubmit, onErrors,)}>
        <motion.div
          variants={container}
          className="flex flex-col gap-2"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Card className="border-none shadow-none ">
            <CardContent>
              {children}
            </CardContent>
          </Card>
        </motion.div>
      </form>
    </Form>
  );
};