import type {Metadata} from "next";
import LoginForm from "docker-manager-web/container/LoginForm/LoginForm";

export const metadata: Metadata = {
  title: 'Login | Gia Phước Express',
  description: 'Login Page to access Admin Page Gia Phước Express.'
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginForm />
    </div>
  );
}