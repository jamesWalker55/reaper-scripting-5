import { getCategories } from "./categories";
import { setClone, setIntersectionMut } from "./utils";

type CategoriesData = ReturnType<typeof getCategories>;

export type FxManager = ReturnType<typeof createManager>;

function orderFx(data: CategoriesData, a: string, b: string): number {
  const aFav = data.favouriteFx.has(a);
  const bFav = data.favouriteFx.has(b);
  // favourites always come first
  if (aFav && !bFav) {
    return -1;
  } else if (!aFav && bFav) {
    return 1;
  }

  const aInfo = data.fxInfo[a];
  const bInfo = data.fxInfo[b];

  // sort by display name
  const aName = aInfo.displayName.toLowerCase();
  const bName = bInfo.displayName.toLowerCase();
  if (aName < bName) {
    return -1;
  } else if (aName > bName) {
    return 1;
  }

  // sort by identifier name
  const aIdent = aInfo.ident.toLowerCase();
  const bIdent = bInfo.ident.toLowerCase();
  if (aIdent < bIdent) {
    return -1;
  } else if (aIdent > bIdent) {
    return 1;
  }

  return 0;
}

export function createManager() {
  let data = getCategories();
  let activeIds: LuaSet<string> = new LuaSet();
  // query keywords must be lowercase
  let query: string[] = [];

  function generateFxList() {
    // collect all FX to be displayed
    let resultSet: LuaSet<string> = new LuaSet();

    // apply folder filters
    if (activeIds.isEmpty()) {
      // no filters active, return all FX in all folders
      for (const [folderId, fxs] of Object.entries(data.folderFx)) {
        for (const fx of fxs) {
          resultSet.add(fx);
        }
      }
    } else {
      // filters active, take the union of all folders
      let working: LuaSet<string> | null = null;
      for (const folderId of activeIds) {
        if (!(folderId in data.folderFx)) {
          continue;
        }
        const folderFxs = data.folderFx[folderId];

        if (working === null) {
          // initial pass, use folder contents as-is
          working = setClone(folderFxs);
          continue;
        }

        // take union / intersection
        setIntersectionMut(working, folderFxs);
      }
      resultSet = working || new LuaSet();
    }
    // collect uids into list
    let result: string[] = [];
    for (const uid of resultSet) {
      result.push(uid);
    }

    // apply typed query filter
    if (query.length > 0) {
      result = result.filter((uid) => {
        const fx = data.fxInfo[uid];
        const fxName = fx.displayName.toLowerCase();
        for (const keyword of query) {
          if (!fxName.includes(keyword)) {
            return false;
          }
        }
        return true;
      });
    }

    // sort fx
    result.sort((a, b) => orderFx(data, a, b));

    return result;
  }

  let fxlist = generateFxList();

  return {
    getFxlist() {
      return fxlist;
    },
    inFavourites(uid: string) {
      return data.favouriteFx.has(uid);
    },
    getFxInfo(uid: string) {
      return data.fxInfo[uid];
    },
    setQuery(text: string) {
      // split by whitespace
      query = [];
      for (const [rv] of string.gmatch(text, "%S+")) {
        query.push(rv.toLowerCase());
      }
      fxlist = generateFxList();
    },
    getActiveIdsMut() {
      return activeIds;
    },
    setActiveIds(newval: typeof activeIds) {
      activeIds = newval;
    },
    regenerateFxList() {
      fxlist = generateFxList();
    },
    getCategories() {
      return data.categories;
    },
  };
}
