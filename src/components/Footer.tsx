import logo from "../assets/funaab.png"

function Footer() {
  const d = new Date();
  const year = d.getFullYear();
  return (
    <div className="flex justify-center items-center bg-accent p-10 h-40 dark:bg-black">
      <div className="space-y-4">
        <div className="md:ml-36 flex justify-center gap-x-4 items-center">
          <div className="w-14">
            <img src={logo} alt="funaab" className="object-cover w-full" />
          </div>
          <h2 className="text-2xl font-semibold text-center">
            Smart Attendance
          </h2>
        </div>
        <div className="md:ml-36 text-sm">
          <p className="text-center">
            &copy; {year}, Federal University of Agriculture, Abeokuta. All
            rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
