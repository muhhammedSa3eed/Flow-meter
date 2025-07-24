import ProjectIdTabs from './ProjectIdTabs';
import { Separator } from './ui/separator';

interface headerProps {
  title: string;
  projectId: number;
  description?: string;
}
const Header = ({ projectId, title, description }: headerProps) => {
  return (
    <>
      <div>
        <div className="mb-4">
          {' '}
          <ProjectIdTabs projectName={title} projectId={projectId} />
        </div>
        <div className="mx-4">
          {' '}
          <strong className="mt-2 inline-block text-xl">{title}</strong>
          {description && <p className="my-2 text-gray-600">{description}</p>}
        </div>
        <Separator className="mx-4 w-[98.5%]" />
      </div>
    </>
  );
};

export default Header;
