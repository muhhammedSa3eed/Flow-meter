"use client";
import { containerMultiStepNavbar as container } from "@/constants/framer-motion";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useMultiStepForm } from "@/hooks/multi-step-form";
import type { Context } from "react";
import type { UseMultiStepFormTypeOptions } from "@/types/multi-step-form";

interface MultiStepNavBarProps<T> extends React.HTMLAttributes<HTMLElement> {
    context: Context<T>;
    ProjectId:number
}

// biome-ignore lint: must be any as it is an any object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MultiStepNavbar<T extends UseMultiStepFormTypeOptions<any>>({ className, context,ProjectId, ...props }: MultiStepNavBarProps<T>) {
    const { currentStepLabel, labels } = useMultiStepForm(context,ProjectId);
    return (
        <ul
            className={cn(
                "flex flex-nowrap  ",
                className
            )}
            {...props}
        >
            {labels.map((label) => (
                <li
                    key={label}
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        currentStepLabel === label ? "font-bold" : "",
                        "rounded-none"
                    )}
                >
                    <div className="relative">
                        {label}
                        {currentStepLabel === label ? (
                            <motion.div
                                className="absolute -bottom-1 left-0 right-0 h-[0.15rem] bg-custom-green"
                                layoutId="underline"
                                variants={container}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            />
                        ) : null}
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default MultiStepNavbar;
