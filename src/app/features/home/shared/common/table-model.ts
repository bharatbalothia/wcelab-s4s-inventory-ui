import { BucTableModel, COMMON } from '@buc/common-components';

export class S4STableModel extends BucTableModel {
  pages: any[];
  allRecords: any[];
  sortMap: any;
  calcPgLen: number;

  /**
   * performs initial data population on given table model and navigates to page 1
   * @param model model to update
   * @param records data to specify/paginate/set
   * @param sortMap custom sorting map
   */
  public populate(records: any[], sortMap: { [ key: number ]: string } = {}) {
    this.allRecords = records;
    this.sortMap = sortMap;
    this.calcPgLen = this.pageLength;
    this.pages = COMMON.calcPagination(records, this.pageLength);

    this.data = this.pages[0];
    this.totalDataLength = records.length;
  }

  /**
   * selects specified page on table represented by given model
   *
   * @param pg page number to navigate to (page numbers are ordinal, i.e., 1-based)
   * @param model model to refresh data on
   */
  public onSelectPage(pg) {
    this.isLoading = true;

    if (this.pageLength !== this.calcPgLen) {
      this.pages = COMMON.calcPagination(this.allRecords, this.pageLength);
    }

    this.calcPgLen = this.pageLength;
    this.currentPage = pg;
    this.data = this.pages[pg - 1];

    this.isLoading = false;
  }

  /**
   * performs custom sort on column specified by idx for records of table represented by given model
   * @param idx column index (0-based)
   * @param model model on which column's records reside
   */
  public onSort(idx) {
    const customSort = this.sortMap;
    if (customSort && customSort[idx]) {
      const field = customSort[idx];
      const s = this.getHeader(idx).ascending ? 1 : -1;
      this.data.sort((l, r) => s * l[idx].data[field].localeCompare(r[idx].data[field]));
    }
  }

  /**
   * @param model model to set page defaults on
   */
  public setPgDefaults() {
    this.pageLength = BucTableModel.DEFAULT_PAGE_LEN;
    this.currentPage = 1;
  }
}
