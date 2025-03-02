import NavBar from "./NavBar";
import DuckList from "./DuckList";

/* import { setIsLoggedIn } from "../utils/token"; */

function Ducks(
  {
    /* setIsLoggedIn */
  }
) {
  return (
    <>
      <NavBar /* setIsLoggedIn={setIsLoggedIn} */ />
      <DuckList />
    </>
  );
}

export default Ducks;
