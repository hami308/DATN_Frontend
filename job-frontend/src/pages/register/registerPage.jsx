import FormRegister from "../../components/formLayout/formLayout";
import RegisterAccount from "./components/registerAccount";
import { useParams } from "react-router-dom";
export default function RegisterPage() {
  const { role } = useParams();
  return (
    <FormRegister>
      <RegisterAccount role={role} />
    </FormRegister>
  );
}
