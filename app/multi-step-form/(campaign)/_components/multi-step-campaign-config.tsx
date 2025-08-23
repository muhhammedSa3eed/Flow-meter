import type {
  Form,
  UseMultiStepFormTypeOptions,
} from "@/types/multi-step-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import Step1 from "./step-1";
import Step2 from "./step-2";
import Step3 from "./step-3";

import buildMultiStepForm from "@/lib/multi-step-form";
import { CampaignFormSchema } from "@/schemas";

// 2 - create the type
export type CampaignFormType = z.infer<typeof CampaignFormSchema>;

// 3 - Initial Data for fields
export const initialFormData: CampaignFormType = {
  System: {
    language: "",
    authenticationToken: "",
    broadcastToClient: "",
    logFullMode: "",
  },
  SMTP: {
    host: "",
    port: "",
    mailSender: "",
    userApiKey: "",
    password: "",
    emailTest: "",
  },
  daqstoreAndAlarms: {
    retentionDAQ: "",
    alarmsRetention: "",
  },
};

const saveFormData: SubmitHandler<CampaignFormType> = async (values) => {
  console.log(values);
};

// 5 - Define the steps and sub-forms and each field for step
export const forms: Form<CampaignFormType>[] = [
  { id: 0, label: "SYSTEM", form: Step1, fields: ["System"] },
  { id: 1, label: "SMTP", form: Step2, fields: ["SMTP"] },
  {
    id: 2,
    label: "DQA STORAGE & ALARMS",
    form: Step3,
    fields: ["daqstoreAndAlarms"],
  },
];

// 6 - Define initial Form Options
const initialFormOptions: UseMultiStepFormTypeOptions<CampaignFormType> = {
  schema: CampaignFormSchema,
  currentStep: 0,
  setCurrentStep: () => {},
  forms,
  saveFormData,
};
// 7 - Build the Context and Provider
export const {
  FormContext: CampaignFormContext,
  FormProvider: CampaignProvider,
} = buildMultiStepForm(initialFormOptions, CampaignFormSchema, initialFormData);
