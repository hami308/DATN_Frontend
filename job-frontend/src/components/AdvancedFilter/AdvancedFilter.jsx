import { useEffect, useState } from "react";

import styles from "./advancedFilter.module.css";

import { getJobTypesApi } from "../../service/job/job_type";
import { getLevelsApi } from "../../service/level/level";

const experienceOptions = [
  { label: "Tất cả", value: "" },
  { label: "Không yêu cầu", value: "0-0" },
  { label: "Dưới 1 năm", value: "0-1" },
  { label: "1 - 3 năm", value: "1-3" },
  { label: "3 - 5 năm", value: "3-5" },
  { label: "Trên 5 năm", value: "5-999" },
];

const salaryOptions = [
  { label: "Tất cả", value: "" },
  { label: "Dưới 10 triệu", value: "0-10000000" },
  { label: "10 - 15 triệu", value: "10000000-15000000" },
  { label: "15 - 20 triệu", value: "15000000-20000000" },
  { label: "20 - 30 triệu", value: "20000000-30000000" },
  { label: "Trên 30 triệu", value: "30000000-999999999" },
];

const parseRange = (value) => {
  if (!value) {
    return {
      min: "",
      max: "",
    };
  }

  const [min, max] = value.split("-");

  return {
    min,
    max,
  };
};

export default function AdvancedFilter({ onFilterChange }) {
  const [jobTypes, setJobTypes] = useState([]);
  const [levels, setLevels] = useState([]);

  const [exp, setExp] = useState("");
  const [salary, setSalary] = useState("");
  const [jobTypeId, setJobTypeId] = useState("");
  const [levelId, setLevelId] = useState("");

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [jobTypesResponse, levelsResponse] = await Promise.all([
          getJobTypesApi(),
          getLevelsApi(),
        ]);

        setJobTypes(jobTypesResponse.data.jobTypes);
        setLevels(levelsResponse.data.levels);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFilterData();
  }, []);

  const emitFilterChange = (nextValues) => {
    const nextExp = nextValues.exp ?? exp;
    const nextSalary = nextValues.salary ?? salary;
    const nextJobTypeId = nextValues.jobTypeId ?? jobTypeId;
    const nextLevelId = nextValues.levelId ?? levelId;

    const expRange = parseRange(nextExp);
    const salaryRange = parseRange(nextSalary);

    onFilterChange?.({
      expMin: expRange.min,
      expMax: expRange.max,
      salaryMin: salaryRange.min,
      salaryMax: salaryRange.max,
      jobTypeId: nextJobTypeId,
      levelId: nextLevelId,
    });
  };

  const handleExpChange = (value) => {
    setExp(value);
    emitFilterChange({ exp: value });
  };

  const handleSalaryChange = (value) => {
    setSalary(value);
    emitFilterChange({ salary: value });
  };

  const handleJobTypeChange = (value) => {
    setJobTypeId(value);
    emitFilterChange({ jobTypeId: value });
  };

  const handleLevelChange = (value) => {
    setLevelId(value);
    emitFilterChange({ levelId: value });
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <span className="material-symbols-outlined">filter_alt</span>
        <p>Bộ lọc nâng cao</p>
      </div>

      <div className={styles.section}>
        <h4>Kinh nghiệm</h4>

        <div className={styles.options}>
          {experienceOptions.map((option) => (
            <label key={option.label}>
              <input
                type="radio"
                name="exp"
                value={option.value}
                checked={exp === option.value}
                onChange={(e) => handleExpChange(e.target.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h4>Hình thức làm việc</h4>

        <div className={styles.options}>
          <label>
            <input
              type="radio"
              name="type"
              value=""
              checked={jobTypeId === ""}
              onChange={(e) => handleJobTypeChange(e.target.value)}
            />
            Tất cả
          </label>

          {jobTypes.map((type) => (
            <label key={type.id}>
              <input
                type="radio"
                name="type"
                value={type.id}
                checked={String(jobTypeId) === String(type.id)}
                onChange={(e) => handleJobTypeChange(e.target.value)}
              />
              {type.name}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h4>Mức lương</h4>

        <div className={styles.options}>
          {salaryOptions.map((option) => (
            <label key={option.label}>
              <input
                type="radio"
                name="salary"
                value={option.value}
                checked={salary === option.value}
                onChange={(e) => handleSalaryChange(e.target.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h4>Cấp bậc</h4>

        <div className={styles.options}>
          <label>
            <input
              type="radio"
              name="level"
              value=""
              checked={levelId === ""}
              onChange={(e) => handleLevelChange(e.target.value)}
            />
            Tất cả
          </label>

          {levels.map((level) => (
            <label key={level.id}>
              <input
                type="radio"
                name="level"
                value={level.id}
                checked={String(levelId) === String(level.id)}
                onChange={(e) => handleLevelChange(e.target.value)}
              />
              {level.name}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
