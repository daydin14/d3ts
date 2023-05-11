// Components
import HorizontalBarChart from "../../components/d3/charts/bar/HorizontalBarChart";

const bardata = [
  { label: "HTML", value: 10 },
  { label: "CSS", value: 20 },
  { label: "JavaScript", value: 30 },
  { label: "TypeScript", value: 40 },
  { label: "React", value: 50 },
];

const Home = () => {
  return (
    <>
      <h1>Home Page</h1>
      <HorizontalBarChart data={bardata} width={500} height={500} />
    </>
  );
};

export default Home;
