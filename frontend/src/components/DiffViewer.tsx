import ReactDiffViewer from "react-diff-viewer-continued";

interface Props {
  oldCode: string;
  newCode: string;
}

export default function DiffViewer({ oldCode, newCode }: Props) {

  if (!newCode) {
    return (
      <div className="p-6 text-muted-foreground">
        Run refactor to view code changes
      </div>
    );
  }

  return (
    <div style={{ height: "100%", overflow: "auto" }}>
      <ReactDiffViewer
        oldValue={oldCode}
        newValue={newCode}
        splitView={true}
        useDarkTheme={true}
        showDiffOnly={false}
      />
    </div>
  );
}