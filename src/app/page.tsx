import Login from "@/components/Login";
import GetText from "./admin/settings/GetText";

export default function Home() {
  return (
    <div className="flex">
      <div className="flex h-screen mx-auto justify-center gap-10 flex-col-reverse md:flex-row items-center p-10">
        <div className="flex flex-col text-justify max-w-80 text-primary my-auto">
          <p className="text-primary text-2xl drop-shadow-sm font-bold text-left">
            <GetText name="systemName" title="System Name" />
          </p>
          <p className="text-sm text-primary text-left mb-5">
            <GetText name="address" title="Address" />
          </p>
          <p className="text-sm">
            <GetText name="mission" title="Mission" />
          </p>
        </div>
        <Login />
      </div>
    </div>
  );
}
