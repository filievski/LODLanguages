# LOD Literal Quality
Code used for the analysis on literal quality for the LOD Laundromat data collection.

### Directory structure

The `algorithm_multi_run.sh` is the main script to be executed. It fires all three libraries on the entire LOD Laundromat collection.

For each of the libraries (cld, ld, tika), there are two files that execute them and tag a document: the scripts `[LIBRARY]_algorithm_fs.sh` and the nodejs scripts `[LIBRARY]_algorithm.js`.

Analogue to this, there are scripts that execute no library, but instead count the tagged and untagged strings in the original data. These are `no_library_multi_run.sh`, `nolibrary_run_fs.sh`, and `nolibrary.js`.

`output/` contains the output summaries by each of the libraries on each document in the LOD Laundromat. It also contains the `nolib/` directory that only counts the amount of tagged and untagged strings per document.

`make_paper_tables/` is a directory that contains the scripts to adapt the processing output to the needs of the paper, i.e. this produces the tables as found in the paper based on the original JSON data in the folder `output/`.

`datatype_catalogs/` contains the frequencies we obtain per datatype.

### Running the code

is as simple as running the command: 

`sh algorithm_multi_run.sh`

**Note:** You need to have Frank and the langdetect installed before that in the root directory of this project.

### Contact

f.ilievski@vu.nl
