import HorizontalBarChart from "../components/d3/charts/bar/HorizontalBarChart";
import ButterflyChart from "../components/d3/charts/butterfly/ButterflyChart";
import SingleStack from "../components/d3/charts/single-stack/SingleStack";
import NavMenu from "../components/nav/NavMenu";

const bardata = [
  { label: "HTML", value: 10 },
  { label: "CSS", value: 20 },
  { label: "JavaScript", value: 30 },
  { label: "TypeScript", value: 40 },
  { label: "React", value: 50 },
];

const singlestackdata = [
  { category: "HTML", value: 10 },
  { category: "CSS", value: 20 },
  { category: "JavaScript", value: 30 },
  { category: "TypeScript", value: 40 },
  { category: "React", value: 50 },
];

const butterflydata = [
  { age: 5, gender: "M", value: 2 },
  { age: 15, gender: "M", value: 12 },
  { age: 25, gender: "M", value: 22 },
  { age: 35, gender: "M", value: 32 },
  { age: 45, gender: "M", value: 42 },

  { age: 5, gender: "F", value: 2 },
  { age: 15, gender: "F", value: 12 },
  { age: 25, gender: "F", value: 22 },
  { age: 35, gender: "F", value: 32 },
  { age: 45, gender: "F", value: 42 },
];

const Root = () => {
  return (
    <>
      <NavMenu />
      <HorizontalBarChart data={bardata} width={500} height={500} />
      <SingleStack data={singlestackdata} width={500} height={500} />
      <ButterflyChart data={butterflydata} width={500} height={500} />
    </>
  );
};

export default Root;
