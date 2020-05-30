# DepHell GitHub Action

An official [GitHub Action](https://help.github.com/en/actions) to run [DepHell](https://github.com/dephell/dephell) commands.

Input variables:

- `dephell-env` -- DepHell environment to run.
- `python-version` -- Python version to use when creating venv.
- `dephell-version` -- DepHell version to install. The latest version is installed by default.

## Example

DepHell config (`pyproject.toml`):

```toml
[tool.dephell.main]
from = {format = "pip", path = "requirements.txt"}
command = "pytest"
```

GitHub Actions workflow (`.github/workflows/main.yml`):

```yaml
on:
  push:
    branches:
      - master
  pull_request:
    branches:
      - master

jobs:
  pytest:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: [3.6, 3.7, 3.8]
    steps:
      - name: Setup Python
        uses: actions/setup-python@v2
        with:
          python-version: ${{ matrix.python-version }}
      - name: Checkout
        uses: actions/checkout@v2
      - name: Run DepHell
        uses: dephell/dephell_action@master
        with:
          dephell-env: pytest
          python-version: ${{ matrix.python-version }}
```

See [DepHell documentation](https://dephell.readthedocs.io/config.html) for details on configuring DepHell.
