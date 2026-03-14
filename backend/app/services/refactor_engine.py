import ast
import subprocess
import tempfile
import sys


def infer_return_type(node):

    for child in ast.walk(node):

        if isinstance(child, ast.Return):

            if isinstance(child.value, ast.BinOp):
                return "number"

            if isinstance(child.value, ast.Str):
                return "string"

            if isinstance(child.value, ast.List):
                return "list"

    return "Any"


def generate_docstring(func_node):

    args = [arg.arg for arg in func_node.args.args]

    args_section = ""

    if args:
        args_section = "Args:\n"
        for arg in args:
            args_section += f"        {arg}: Parameter `{arg}` of the function.\n"

    return_type = infer_return_type(func_node)

    docstring = f"""
{func_node.name} function.

{args_section}
Returns:
        {return_type}: Result of the computation.
"""

    return docstring.strip()


def analyze_quality(node):

    warnings = []

    if len(node.args.args) > 4:
        warnings.append("Too many arguments")

    if len(node.body) > 20:
        warnings.append("Function too long")

    return warnings


def process_code(code):

    logs = []

    logs.append({"type": "info", "message": "Starting refactor pipeline..."})

    tree = ast.parse(code)

    logs.append({"type": "info", "message": "AST parsing complete"})

    functions = []
    docstrings_added = 0
    warnings = []

    lines = code.split("\n")

    insertions = []

    for node in ast.walk(tree):

        if isinstance(node, ast.FunctionDef):

            existing_doc = ast.get_docstring(node)

            functions.append({
                "name": node.name,
                "line": node.lineno,
                "has_docstring": existing_doc is not None
            })

            quality = analyze_quality(node)

            for w in quality:
                warnings.append(f"{node.name}: {w}")

            indent = " " * (node.col_offset + 4)

            if existing_doc is None:

                doc = generate_docstring(node)

                block = [
                    indent + '"""',
                    *(indent + line for line in doc.split("\n")),
                    indent + '"""'
                ]

                insertions.append((node.lineno, "\n".join(block)))

                docstrings_added += 1

    for lineno, block in sorted(insertions, reverse=True):
        lines.insert(lineno, block)

    refactored_code = "\n".join(lines)

    logs.append({"type": "info", "message": f"{len(functions)} functions detected"})
    logs.append({"type": "success", "message": f"{docstrings_added} docstrings generated"})

    for w in warnings:
        logs.append({"type": "warning", "message": w})

    execution_result = {"success": True}

    try:

        with tempfile.NamedTemporaryFile(delete=False, suffix=".py", mode="w") as tmp:
            tmp.write(refactored_code)
            temp_file = tmp.name

        subprocess.check_output(
            [sys.executable, "-m", "py_compile", temp_file],
            stderr=subprocess.STDOUT
        )

        logs.append({"type": "success", "message": "Syntax validation passed"})

    except subprocess.CalledProcessError:

        execution_result = {"success": False}

        logs.append({"type": "error", "message": "Syntax validation failed"})

    return {
        "refactored_code": refactored_code,
        "functions": functions,
        "functions_detected": len(functions),
        "docstrings_added": docstrings_added,
        "execution_result": execution_result,
        "logs": logs
    }