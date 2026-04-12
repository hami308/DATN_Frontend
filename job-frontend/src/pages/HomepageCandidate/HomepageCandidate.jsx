import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Homepage.css";
import Sidebar from "./components/Sidebar";
import JobCard from "../../components/JobCard/JobCard";
import CatFace from "../../components/CatFace/CatFace";
import AcvancedFilter from "../../components/AdvancedFilter/AdvancedFilter";
import SearchBar from "../../components/SearchBar/SearchBar";
import logo from "../../assets/images/logo.png";
export default function Homepage() {
  const jobCards = [
    {
      logo: logo,
      title: "Senior UX Designer",
      type: "Part Time",
      location: "Đà Nẵng",
      salary_min: 30000,
      salary_max: 35000,
      deadline: "Còn 4 ngày",
    },
    {
      logo: logo,
      title: "Software Engineer",
      type: "Full Time",
      location: "Thanh Khê",
      salary_min: 50000,
      salary_max: 60000,
      deadline: "Còn 4 ngày",
    },
    {
      logo: logo,
      title: "Software Engineer",
      type: "Full Time",
      location: "Thanh Khê",
      salary_min: 50000,
      salary_max: 60000,
      deadline: "Còn 4 ngày",
    },
    {
      logo: logo,
      title: "Software Engineer",
      type: "Full Time",
      location: "Thanh Khê",
      salary_min: 50000,
      salary_max: 60000,
      deadline: "Còn 4 ngày",
    },
    {
      logo: logo,
      title: "Software Engineer",
      type: "Full Time",
      location: "Thanh Khê",
      salary_min: 50000,
      salary_max: 60000,
      deadline: "Còn 4 ngày",
    },
    {
      logo: logo,
      title: "Software Engineer",
      type: "Full Time",
      location: "Thanh Khê",
      salary_min: 50000,
      salary_max: 60000,
      deadline: "Còn 4 ngày",
    },
    {
      logo: logo,
      title: "Software Engineer",
      type: "Full Time",
      location: "Thanh Khê",
      salary_min: 50000,
      salary_max: 60000,
      deadline: "Còn 4 ngày",
    },
    {
      logo: logo,
      title: "Software Engineer",
      type: "Full Time",
      location: "Thanh Khê",
      salary_min: 50000,
      salary_max: 60000,
      deadline: "Còn 4 ngày",
    },
    {
      logo: logo,
      title: "Software Engineer",
      type: "Full Time",
      location: "Thanh Khê",
      salary_min: 50000,
      salary_max: 60000,
      deadline: "Còn 4 ngày",
    },
    {
      logo: logo,
      title: "Software Engineer",
      type: "Full Time",
      location: "Thanh Khê",
      salary_min: 50000,
      salary_max: 60000,
      deadline: "Còn 4 ngày",
    },
    {
      logo: logo,
      title: "Software Engineer",
      type: "Full Time",
      location: "Thanh Khê",
      salary_min: 50000,
      salary_max: 60000,
      deadline: "Còn 4 ngày",
    },
  ];
  return (
    <div className="homepage">
      <Header />

      <div className="main">
        <Sidebar />

        <div className="right">
          <div className="top">
            <CatFace />
            <SearchBar />
          </div>

          <div className="body">
            <div className="filter">
              <AcvancedFilter />
            </div>
            <div className="list">
              {jobCards.map((job, index) => (
                <JobCard
                  key={index}
                  logo={job.logo}
                  title={job.title}
                  type={job.type}
                  location={job.location}
                  salary={job.salary_min + "VND–" + job.salary_max + "VND"}
                  deadline={job.deadline}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
