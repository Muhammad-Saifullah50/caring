"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "@/components/SubmitButton"
import { useState } from "react"
import { UserFormSchema } from "@/validations/validations"
import { createUser } from "@/actions/patient.actions"
import { useRouter } from "next/navigation"
import { useToast } from "../ui/use-toast"

export enum FormFieldType {
    INPUT = 'input',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    CHECKBOX = 'checkbox',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton'
}



const PatientForm = () => {

    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter();
    const { toast } = useToast()


    const form = useForm<z.infer<typeof UserFormSchema>>({
        resolver: zodResolver(UserFormSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: ""
        },
    })

    async function onSubmit({ name, email, phone }: z.infer<typeof UserFormSchema>) {
        setIsLoading(true);
        try {
            const userData = { name, email, phone };

            const user = await createUser(userData);
            if (user) router.push(`/patients/${user.$id}/register`);
        } catch (error: any) {
            toast({
                title: "Invalid Credentials",
                description: error?.message,
                variant: "destructive",
            });
            setIsLoading(false);
            form.reset();
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                <section className="mb-12 space-y-4">
                    <h1 className="header">Hi there 👋 </h1>
                    <p className="text-dark-700">Login to schedule your appointment</p>
                </section>

                <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.INPUT}
                    name="name"
                    label="Full Name"
                    placeholder="John Doe"
                    iconSrc={"/assets/icons/user.svg"}
                    iconAlt="user"
                />
                <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.INPUT}
                    name="email"
                    label="Email Address"
                    placeholder="abc@example.com"
                    iconSrc={"/assets/icons/email.svg"}
                    iconAlt="email"
                />
                <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.PHONE_INPUT}
                    name="phone"
                    label="Phone Number"
                    placeholder="123 4567890"
                />
                <SubmitButton
                    isLoading={isLoading}
                >
                    Get Started
                </SubmitButton>
            </form>
        </Form>
    )

}

export default PatientForm