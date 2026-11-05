import { useNavigate } from "react-router-dom";
import CircleImage from "../../public/images/circle.png"
import ZigZagImage from "../../public/images/circle.png"

const OnboardingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex  justify-center items-start md:p-7 min-h-screen h-screen">
      <main className="relative shadow-2xl w-full md:max-w-[90%] h-full overflow-hidden md:rounded-3xl bg-white">
        <section className="  grid h-full grid-cols-1 grid-rows-[70%_30%] lg:grid-cols-2 lg:grid-rows-1">
          <div className=" h-full bg-primary overflow-hidden relative">
            <img
              src={CircleImage}
              alt="Circle"
              className="absolute right-0 "
            />
            <img
              src={ZigZagImage}
              alt="zig zag"
              className="absolute  top-40 "
            />

            <img
              src={ZigZagImage}
              alt="zig zag"
              className="absolute -right-10 bottom-12"
            />
          </div>
          <div className=" h-full  flex flex-col justify-between p-5 md:p-10 lg:p-20">
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold">
                Manage What To Do
              </h1>
              <p className="text-sm md:text-base mt-1 lg:mt-3 text-[#717171]">
                The best way to manage what you have to do, don't forget your
                plans.
              </p>
            </div>
            <button
              className="bg-primary text-white py-2 md:py-3 lg:py-4 border-none cursor-pointer"
              onClick={() => navigate("home")}
            >
              Get Started
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default OnboardingPage;
