const Navbar = (value: any) => {
  return (
    <div style={value.navbar}>
      <div style={value.center}>
          
        <div className="size-20 bg-primary rounded-full flex items-center justify-center p-1 overflow-hidden div-margin">
                    <img src="/src/assets/logo.avif" alt="LocalWorks" className="rounded-full" />
                  </div>
        <h1 className="text-2xl font-bold m-1">LocalWorks</h1>
      </div>
      <div className="options" style={value.btns}>
        <button style={value.dashboard}>Dashboard</button>
        <button style={value.postedJobs}>Posted Jobs</button>
        <button style={value.managePost}>Manage Post</button>
        <button style={value.reports}>Reports</button>
        <button style={value.notifications}>Notifications</button>
        <button style={value.profiles}>Profiles</button>
      </div>
    </div>
  )
}

export default Navbar