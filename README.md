# DepHell GitHub Action

An official [GitHub Action](https://help.github.com/en/actions) to run [DepHell](https://github.com/dephell/dephell) commands.

Input variables:

- `dephell-env` -- DepHell environment to run. Default: job name
- `python-version` -- Python version to use when creating venv. Default: `python3`
- `dephell-version` -- DepHell version to install. Default: the latest release.

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
  # env name detected from the job name, python version explicitly enumerated
  pytest:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version:
          - "3.6"
          - "3.7"
          - "3.8"
          - pypy3
    steps:
      - name: Setup Python
        uses: actions/setup-python@v2
        with:
          python-version: ${{ matrix.python-version }}
      - name: Checkout
        uses: actions/checkout@v2
      - name: Run DepHell
        uses: dephell/dephell_action@master

  # env name enumerated, python version is 3.7
  linters:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        dephell-env:
          - flake8
          - typing
    steps:
      - name: Setup Python
        uses: actions/setup-python@v2
        with:
          python-version: "3.7"
      - name: Checkout
        uses: actions/checkout@v2
      - name: Run DepHell
        uses: dephell/dephell_action@master
        with:
          dephell-env: ${{ matrix.dephell-env }}
```

See [DepHell documentation](https://dephell.readthedocs.io/config.html) for details on configuring DepHell.
