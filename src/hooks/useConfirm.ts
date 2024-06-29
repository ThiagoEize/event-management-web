import { useHelperContext } from "../context/HelperContext";

const useConfirm = () => {
  const { confirm } = useHelperContext();
  return confirm;
};

export default useConfirm;
