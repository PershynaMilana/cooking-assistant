import { PageSpinner } from "components/layout/PageSpinner";

// one Suspense boundary for every route, exactly as the single <Suspense> around the old
// router did - it is also what lets pages read search params without opting out of prerendering
const Loading = () => <PageSpinner />;

export default Loading;
