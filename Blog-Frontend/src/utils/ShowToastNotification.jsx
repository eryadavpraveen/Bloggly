import { toast } from "sonner"

export const ShowErrorNotification = (error) => {
    const errorMessage = error?.response?.data.message || "An error occurred. Please try again.";
    toast.error(errorMessage)

}

export const ShowSuccessNotification = (reply) => {
    const successMessage = reply?.message || "Success";

    toast.success(successMessage);
}

export const ShowDirectSuccessMessage = (message) => {
    const successMessage = message || "Success";
    toast.success(successMessage);
}

export const ShowDirectErrorMessage = (message) => {
    const errorMessage = message || "An error occurred. Please try again.";
    toast.error(errorMessage);
}

export const getErrorMessage = (error) => {
    if (typeof error === "string") return error;
    return (
        error?.response?.data?.message ||
        error?.message ||
        "An error occurred. Please try again."
    );
};