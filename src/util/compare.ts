
function isDigit(ch:any) {
  return ch >= 0 && ch <= 9;
}

function getChunk(s:string, slength:number, marker:number):any {
  let chunk = new String();
  let c = s.charAt(marker);
  chunk += c;
  marker++;
  if (isDigit(c)) {
    while (marker < slength) {
      c = s.charAt(marker);
      if (!isDigit(c))
        break;
      chunk += c;
      marker++;
    }
  } else {
    while (marker < slength) {
      c = s.charAt(marker);
      if (isDigit(c))
        break;
      chunk += c;
      marker++;
    }
  }
  return chunk.toString();
}

/**
 * Alphanum 排序方法
 */
export function compareString(s1:string, s2:string){
  let thisMarker = 0;
  let thatMarker = 0;
  const s1Length = s1.length;
  const s2Length = s2.length;

  while (thisMarker < s1Length && thatMarker < s2Length) {
    const thisChunk = getChunk(s1, s1Length, thisMarker);
    thisMarker += thisChunk.length;

    var thatChunk = getChunk(s2, s2Length, thatMarker);
    thatMarker += thatChunk.length;

    var result = 0;
    if (isDigit(thisChunk.charAt(0)) && isDigit(thatChunk.charAt(0))) {
      var thisChunkLength = thisChunk.length;
      result = thisChunkLength - thatChunk.length;
      if (result === 0) {
        for (var i = 0; i < thisChunkLength; i++) {
          result = thisChunk.charAt(i) - thatChunk.charAt(i);
          if (result !== 0) {
            return result;
          }
        }
      }
    } else {
      result = thisChunk.localeCompare(thatChunk);
    }
    if (result !== 0)
      return result;
  }
  return s1Length - s2Length;
}
