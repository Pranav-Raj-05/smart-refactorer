import ast
import subprocess
import sys
import tempfile


def generate_docstring(func):
    args = [arg.arg for arg in func.args.args]

    doc = f"{func.name} function.\n\n"

    if args:
        doc += "Args:\n"
        for a in args:
            doc += f"    {a}: Parameter `{a}` of the function.\n"

    doc += "\nReturns:\n    value"

    return doc


class DocstringAdder(ast.NodeTransformer):

    def visit_FunctionDef(self, node):
        self.generic_visit(node)

        if ast.get_docstring(node) is None:
            docstring = generate_docstring(node)
            doc_node = ast.Expr(value=ast.Constant(value=docstring))
            node.body.insert(0, doc_node)

        return node


def process_code(code: str):

    logs = []
    logs.append("[INFO] Starting refactor pipeline...")

    try:
        tree = ast.parse(code)
        logs.append("[INFO] AST parsing complete")
    except Exception as e:
        logs.append(f"[ERROR] Parsing failed: {str(e)}")
        return {
            "refactored_code": code,
            "functions": [],
            "functions_detected": 0,
            "docstrings_added": 0,
            "execution_result": {"success": False},
            "logs": logs
        }

    functions = []
    docstrings_added = 0

    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef):
            has_doc = ast.get_docstring(node) is not None

            functions.append({
                "name": node.name,
                "line": node.lineno,
                "has_docstring": has_doc
            })

            if not has_doc:
                docstrings_added += 1

    transformer = DocstringAdder()
    new_tree = transformer.visit(tree)
    ast.fix_missing_locations(new_tree)

    refactored_code = ast.unparse(new_tree)

    logs.append(f"[OK] {docstrings_added} docstrings generated")

    validation = {"success": True}

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".py") as tmp:
            tmp.write(refactored_code.encode())
            tmp_path = tmp.name

        subprocess.check_output(
            [sys.executable, "-m", "py_compile", tmp_path],
            stderr=subprocess.STDOUT,
            timeout=3
        )

    except Exception:
        validation = {"success": False}

    return {
        "refactored_code": refactored_code,
        "functions": functions,
        "functions_detected": len(functions),
        "docstrings_added": docstrings_added,
        "execution_result": validation,
        "logs": logs
    }