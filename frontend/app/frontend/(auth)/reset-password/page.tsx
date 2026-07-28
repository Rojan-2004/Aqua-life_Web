// app/(auth)/reset-password/page.tsx
import ResetPasswordForm from "../_components/passwordResetForm";

export default async function Page({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const query = await searchParams;
    const token = (query.token as string) || "";
    return (
        <div>
            <ResetPasswordForm token={token} />
        </div>
    );
}