# DepHell Github Action

An official [Github Action](https://help.github.com/en/actions) to run [DepHell](https://github.com/dephell/dephell) commands.

```yaml
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
      - name: Run DepHell
        uses: actions/dephell
        with:
          dephell-env: pytest
```
