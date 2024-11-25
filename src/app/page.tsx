// src/app/page.tsx
import Login from "@/components/Login";
import GetText from "./admin/settings/GetText";
import ToastProvider from "@/components/ToastProvider";

export default function Home() {
  return (
    <div className="flex h-screen">
      <div className="relative flex h-screen w-full items-center justify-center bg-gradient-to-r from-blue-900 to-teal-500 p-1">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('/img/bg-water.jpg')" }}></div>
        <div className="relative flex flex-col-reverse items-center justify-center gap-10 md:flex-row p-10">
          <div className="hidden md:flex flex-col text-justify max-w-80 text-primary my-auto">
            <p className="text-4xl text-white font-bold drop-shadow-lg">
              <GetText name="systemName" title="System Name" />
            </p>
            <p className="text-md text-white drop-shadow-md">
              <GetText name="address" title="Address" />
            </p>
            <p className="text-sm text-white leading-relaxed">
              <GetText name="mission" title="Mission" />
            </p>
          </div>
          <Login />
          <ToastProvider />
        </div>
      </div>
    </div>
  );
}
