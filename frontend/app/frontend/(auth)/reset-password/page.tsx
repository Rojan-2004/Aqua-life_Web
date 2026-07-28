// app/(auth)/reset-password/page.tsx
import ResetPasswordForm from "../_components/passwordResetForm";

export default async function Page({
    params,
    searchParams
}: {
    params: Promise<{ token?: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const paramToken = (await params)?.token;
    const query = await searchParams;
    const token = paramToken || (query.token as string);
    return (
        <div>
            <ResetPasswordForm token={token} />
        </div>
    );
}