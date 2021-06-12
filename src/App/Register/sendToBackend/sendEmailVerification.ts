import { auth } from "../../../Firebase";

export const sendEmailVerification = async (paymentId?: string) => {
    try {
        const url = process.env.CONTINUE_URL + (paymentId ? `/pagamento/${paymentId}/escolher-cartao` : "/login");
        await auth.currentUser.sendEmailVerification({ url });
    } catch (error) {
        console.error("Error sending email verification", error);
        throw error;
    }
};
