import { RightComponent } from "../components/RightComponent";
import { UserLeft } from "../components/UserLeft";

const Home = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <section className={"flex flex-col lg:grid lg:grid-cols-12 py-2 lg:py-8"}>
      <section className={"lg:col-span-3"}>
        <UserLeft />
      </section>
      <section className={"col-span-6 px-2 pb-16 lg:px-4 py-0"}>
        {children}
      </section>
      <section className={"lg:col-span-3"}>
        <RightComponent />
      </section>
    </section>
  );
};

export default Home;
