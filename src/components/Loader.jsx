
import '../css/FaviconLoader.css'; // Import the CSS file

const FaviconLoader = () => {
  return (
    <div className="loader-container">
      <img src="../../public/favicon.svg" alt="Loading..." className="favicon-loader" />
    </div>
  );
};

export default FaviconLoader;


















// import HashLoader from "react-spinners/HashLoader";

// const Loader = ({ containerHeight = "60vh" }) => {
//   return (
//     <div
//       className="flex items-center justify-center min-w-full"
//       style={{ height: containerHeight }}
//     >
//       <HashLoader size={60} color="#0067FF" />
//     </div>
//   );
// };

// export default Loader;