"use server";

import { createAdminSupabaseClient } from "@/lib/supabase";
import { z } from "zod";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address").max(255),
  message: z.string().min(1, "Message is required").max(5000),
});

export type ContactState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function submitContact(prevState: ContactState, formData: FormData): Promise<ContactState> {
  try {
    const data = {
      firstName: formData.get("first-name") as string,
      lastName: formData.get("last-name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    const validatedData = contactSchema.safeParse(data);

    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors,
        message: "Please fix the errors in the form.",
      };
    }

    const supabase = createAdminSupabaseClient();
    
    if (!supabase) {
      // If we don't have Supabase configured locally, just mock success
      console.warn("No Supabase client available. Contact submission mocked.", validatedData.data);
      return { success: true, message: "Thanks for reaching out! We'll get back to you soon." };
    }

    const { error } = await supabase.from("contact_submissions").insert({
      first_name: validatedData.data.firstName,
      last_name: validatedData.data.lastName,
      email: validatedData.data.email,
      message: validatedData.data.message,
    });

    if (error) {
      console.error("Error inserting contact submission:", error);
      return {
        success: false,
        message: "Something went wrong on our end. Please try again later.",
      };
    }

    return {
      success: true,
      message: "Thanks for reaching out! We'll get back to you soon.",
    };
  } catch (error) {
    console.error("Unexpected error in submitContact:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}
