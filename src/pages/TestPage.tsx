import { useParams } from "react-router-dom";
import { getTest } from "@/data/tests";
import TestLayout from "@/components/tests/TestLayout";
import NotFound from "./NotFound";

const TestPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const config = slug ? getTest(slug) : undefined;

  if (!config) {
    return <NotFound />;
  }

  return <TestLayout config={config} />;
};

export default TestPage;
