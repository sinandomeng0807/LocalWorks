interface JobProps {
  title: string;
  number: number;
}

const Job = ({ title, number }: JobProps) => {
  return (
    <div className="job-box-container">
      <div className="job-info">
        <h3 className="job-title">{title}</h3>
        <div className="job-number">{number}</div>
      </div>
    </div>
  )
}

export default Job