const Job = (value: any) => {
  return (
    <div className="job-box-container">
      <h2>{value.title}</h2>
      <b>{value.number}</b>
    </div>
  )
}

export default Job