import Login from "@/components/Login";

export default function Home() {
  return (
    <div className="flex">
      <div className="flex h-screen mx-auto justify-center gap-10 flex-col-reverse md:flex-row items-center p-10">
        <div className="flex flex-col text-justify max-w-80 text-primary text-sm my-auto">
          <p className="text-neutral text-lg font-bold text-left">
            Barangay Balao
          </p>
          <p className="text-neutral font-bold text-left mb-5">
            Waterworks Management and Billing System
          </p>
          <p className="text-xs">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellat
            minima quidem pariatur, dolore nisi eaque ex voluptatum adipisci
            reiciendis est soluta enim doloremque aliquam vero quos modi. Rerum,
            iure? Vel! Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste ad
            repellat architecto dolorem a, voluptates laudantium repudiandae
            dignissimos expedita sed minima explicabo nam.
          </p>
        </div>
        <Login />
      </div>
    </div>
  );
}
