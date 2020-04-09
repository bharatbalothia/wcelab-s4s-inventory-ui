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
  public static populate(model: S4STableModel, records: any[], sortMap: { [ key: number ]: string }) {
    model.allRecords = records;
    model.sortMap = sortMap;
    model.calcPgLen = model.pageLength;
    model.pages = COMMON.calcPagination(records, model.pageLength);

    model.data = model.pages[0];
    model.totalDataLength = records.length;
  }

  /**
   * selects specified page on table represented by given model
   *
   * @param pg page number to navigate to (page numbers are ordinal, i.e., 1-based)
   * @param model model to refresh data on
   */
  public static selectPage(pg, model: S4STableModel) {
    model.isLoading = true;

    if (model.pageLength !== model.calcPgLen) {
      model.pages = COMMON.calcPagination(model.allRecords, model.pageLength);
    }

    model.calcPgLen = model.pageLength;
    model.currentPage = pg;
    model.data = model.pages[pg - 1];

    model.isLoading = false;
  }

  /**
   * performs custom sort on column specified by idx for records of table represented by given model
   * @param idx column index (0-based)
   * @param model model on which column's records reside
   */
  public static sortColumn(idx, model: S4STableModel) {
    const customSort = model.sortMap;
    if (customSort && customSort[idx]) {
      const field = customSort[idx];
      const s = model.getHeader(idx).ascending ? 1 : -1;
      model.data.sort((l, r) => s * l[idx].data[field].localeCompare(r[idx].data[field]));
    }
  }

  /**
   * @param model model to set page defaults on
   */
  public static setPgDefaults(model: S4STableModel) {
    model.pageLength = BucTableModel.DEFAULT_PAGE_LEN;
    model.currentPage = 1;
  }
}
