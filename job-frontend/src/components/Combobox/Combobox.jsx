import styles from "./Combobox.module.css";

export default function Combobox({ options = [], defaultValue, onSelect }) {
  return (
    <div className={styles.combobox}>
      <select
        className={styles.select}
        defaultValue={defaultValue}
        onChange={(e) => onSelect && onSelect(e.target.value)}
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
