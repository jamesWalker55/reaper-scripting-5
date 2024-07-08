AddCwdToImportPaths();

import { encode } from "json";
import { FX } from "reaper-api/fx";
import { getSelectedTracks } from "reaper-api/track";

const paramsToLink: { ident: string; inv?: true }[] = [
  { ident: "0:0" }, // Band 1 Used
  { ident: "1:1" }, // Band 1 Enabled
  { ident: "2:2" }, // Band 1 Frequency
  { ident: "3:3", inv: true }, // Band 1 Gain
  { ident: "6:6" }, // Band 1 Threshold
  { ident: "7:7" }, // Band 1 Q
  { ident: "8:8" }, // Band 1 Shape
  { ident: "9:9" }, // Band 1 Slope
  { ident: "10:10" }, // Band 1 Stereo Placement
  { ident: "12:12" }, // Band 1 Solo
  { ident: "13:13" }, // Band 2 Used
  { ident: "14:14" }, // Band 2 Enabled
  { ident: "15:15" }, // Band 2 Frequency
  { ident: "16:16", inv: true }, // Band 2 Gain
  { ident: "19:19" }, // Band 2 Threshold
  { ident: "20:20" }, // Band 2 Q
  { ident: "21:21" }, // Band 2 Shape
  { ident: "22:22" }, // Band 2 Slope
  { ident: "23:23" }, // Band 2 Stereo Placement
  { ident: "25:25" }, // Band 2 Solo
  { ident: "26:26" }, // Band 3 Used
  { ident: "27:27" }, // Band 3 Enabled
  { ident: "28:28" }, // Band 3 Frequency
  { ident: "29:29", inv: true }, // Band 3 Gain
  { ident: "32:32" }, // Band 3 Threshold
  { ident: "33:33" }, // Band 3 Q
  { ident: "34:34" }, // Band 3 Shape
  { ident: "35:35" }, // Band 3 Slope
  { ident: "36:36" }, // Band 3 Stereo Placement
  { ident: "38:38" }, // Band 3 Solo
  { ident: "39:39" }, // Band 4 Used
  { ident: "40:40" }, // Band 4 Enabled
  { ident: "41:41" }, // Band 4 Frequency
  { ident: "42:42", inv: true }, // Band 4 Gain
  { ident: "45:45" }, // Band 4 Threshold
  { ident: "46:46" }, // Band 4 Q
  { ident: "47:47" }, // Band 4 Shape
  { ident: "48:48" }, // Band 4 Slope
  { ident: "49:49" }, // Band 4 Stereo Placement
  { ident: "51:51" }, // Band 4 Solo
  { ident: "52:52" }, // Band 5 Used
  { ident: "53:53" }, // Band 5 Enabled
  { ident: "54:54" }, // Band 5 Frequency
  { ident: "55:55", inv: true }, // Band 5 Gain
  { ident: "58:58" }, // Band 5 Threshold
  { ident: "59:59" }, // Band 5 Q
  { ident: "60:60" }, // Band 5 Shape
  { ident: "61:61" }, // Band 5 Slope
  { ident: "62:62" }, // Band 5 Stereo Placement
  { ident: "64:64" }, // Band 5 Solo
  { ident: "65:65" }, // Band 6 Used
  { ident: "66:66" }, // Band 6 Enabled
  { ident: "67:67" }, // Band 6 Frequency
  { ident: "68:68", inv: true }, // Band 6 Gain
  { ident: "71:71" }, // Band 6 Threshold
  { ident: "72:72" }, // Band 6 Q
  { ident: "73:73" }, // Band 6 Shape
  { ident: "74:74" }, // Band 6 Slope
  { ident: "75:75" }, // Band 6 Stereo Placement
  { ident: "77:77" }, // Band 6 Solo
  { ident: "78:78" }, // Band 7 Used
  { ident: "79:79" }, // Band 7 Enabled
  { ident: "80:80" }, // Band 7 Frequency
  { ident: "81:81", inv: true }, // Band 7 Gain
  { ident: "84:84" }, // Band 7 Threshold
  { ident: "85:85" }, // Band 7 Q
  { ident: "86:86" }, // Band 7 Shape
  { ident: "87:87" }, // Band 7 Slope
  { ident: "88:88" }, // Band 7 Stereo Placement
  { ident: "90:90" }, // Band 7 Solo
  { ident: "91:91" }, // Band 8 Used
  { ident: "92:92" }, // Band 8 Enabled
  { ident: "93:93" }, // Band 8 Frequency
  { ident: "94:94", inv: true }, // Band 8 Gain
  { ident: "97:97" }, // Band 8 Threshold
  { ident: "98:98" }, // Band 8 Q
  { ident: "99:99" }, // Band 8 Shape
  { ident: "100:100" }, // Band 8 Slope
  { ident: "101:101" }, // Band 8 Stereo Placement
  { ident: "103:103" }, // Band 8 Solo
  { ident: "104:104" }, // Band 9 Used
  { ident: "105:105" }, // Band 9 Enabled
  { ident: "106:106" }, // Band 9 Frequency
  { ident: "107:107", inv: true }, // Band 9 Gain
  { ident: "110:110" }, // Band 9 Threshold
  { ident: "111:111" }, // Band 9 Q
  { ident: "112:112" }, // Band 9 Shape
  { ident: "113:113" }, // Band 9 Slope
  { ident: "114:114" }, // Band 9 Stereo Placement
  { ident: "116:116" }, // Band 9 Solo
  { ident: "117:117" }, // Band 10 Used
  { ident: "118:118" }, // Band 10 Enabled
  { ident: "119:119" }, // Band 10 Frequency
  { ident: "120:120", inv: true }, // Band 10 Gain
  { ident: "123:123" }, // Band 10 Threshold
  { ident: "124:124" }, // Band 10 Q
  { ident: "125:125" }, // Band 10 Shape
  { ident: "126:126" }, // Band 10 Slope
  { ident: "127:127" }, // Band 10 Stereo Placement
  { ident: "129:129" }, // Band 10 Solo
  { ident: "130:130" }, // Band 11 Used
  { ident: "131:131" }, // Band 11 Enabled
  { ident: "132:132" }, // Band 11 Frequency
  { ident: "133:133", inv: true }, // Band 11 Gain
  { ident: "136:136" }, // Band 11 Threshold
  { ident: "137:137" }, // Band 11 Q
  { ident: "138:138" }, // Band 11 Shape
  { ident: "139:139" }, // Band 11 Slope
  { ident: "140:140" }, // Band 11 Stereo Placement
  { ident: "142:142" }, // Band 11 Solo
  { ident: "143:143" }, // Band 12 Used
  { ident: "144:144" }, // Band 12 Enabled
  { ident: "145:145" }, // Band 12 Frequency
  { ident: "146:146", inv: true }, // Band 12 Gain
  { ident: "149:149" }, // Band 12 Threshold
  { ident: "150:150" }, // Band 12 Q
  { ident: "151:151" }, // Band 12 Shape
  { ident: "152:152" }, // Band 12 Slope
  { ident: "153:153" }, // Band 12 Stereo Placement
  { ident: "155:155" }, // Band 12 Solo
  { ident: "156:156" }, // Band 13 Used
  { ident: "157:157" }, // Band 13 Enabled
  { ident: "158:158" }, // Band 13 Frequency
  { ident: "159:159", inv: true }, // Band 13 Gain
  { ident: "162:162" }, // Band 13 Threshold
  { ident: "163:163" }, // Band 13 Q
  { ident: "164:164" }, // Band 13 Shape
  { ident: "165:165" }, // Band 13 Slope
  { ident: "166:166" }, // Band 13 Stereo Placement
  { ident: "168:168" }, // Band 13 Solo
  { ident: "169:169" }, // Band 14 Used
  { ident: "170:170" }, // Band 14 Enabled
  { ident: "171:171" }, // Band 14 Frequency
  { ident: "172:172", inv: true }, // Band 14 Gain
  { ident: "175:175" }, // Band 14 Threshold
  { ident: "176:176" }, // Band 14 Q
  { ident: "177:177" }, // Band 14 Shape
  { ident: "178:178" }, // Band 14 Slope
  { ident: "179:179" }, // Band 14 Stereo Placement
  { ident: "181:181" }, // Band 14 Solo
  { ident: "182:182" }, // Band 15 Used
  { ident: "183:183" }, // Band 15 Enabled
  { ident: "184:184" }, // Band 15 Frequency
  { ident: "185:185", inv: true }, // Band 15 Gain
  { ident: "188:188" }, // Band 15 Threshold
  { ident: "189:189" }, // Band 15 Q
  { ident: "190:190" }, // Band 15 Shape
  { ident: "191:191" }, // Band 15 Slope
  { ident: "192:192" }, // Band 15 Stereo Placement
  { ident: "194:194" }, // Band 15 Solo
  { ident: "195:195" }, // Band 16 Used
  { ident: "196:196" }, // Band 16 Enabled
  { ident: "197:197" }, // Band 16 Frequency
  { ident: "198:198", inv: true }, // Band 16 Gain
  { ident: "201:201" }, // Band 16 Threshold
  { ident: "202:202" }, // Band 16 Q
  { ident: "203:203" }, // Band 16 Shape
  { ident: "204:204" }, // Band 16 Slope
  { ident: "205:205" }, // Band 16 Stereo Placement
  { ident: "207:207" }, // Band 16 Solo
  { ident: "208:208" }, // Band 17 Used
  { ident: "209:209" }, // Band 17 Enabled
  { ident: "210:210" }, // Band 17 Frequency
  { ident: "211:211", inv: true }, // Band 17 Gain
  { ident: "214:214" }, // Band 17 Threshold
  { ident: "215:215" }, // Band 17 Q
  { ident: "216:216" }, // Band 17 Shape
  { ident: "217:217" }, // Band 17 Slope
  { ident: "218:218" }, // Band 17 Stereo Placement
  { ident: "220:220" }, // Band 17 Solo
  { ident: "221:221" }, // Band 18 Used
  { ident: "222:222" }, // Band 18 Enabled
  { ident: "223:223" }, // Band 18 Frequency
  { ident: "224:224", inv: true }, // Band 18 Gain
  { ident: "227:227" }, // Band 18 Threshold
  { ident: "228:228" }, // Band 18 Q
  { ident: "229:229" }, // Band 18 Shape
  { ident: "230:230" }, // Band 18 Slope
  { ident: "231:231" }, // Band 18 Stereo Placement
  { ident: "233:233" }, // Band 18 Solo
  { ident: "234:234" }, // Band 19 Used
  { ident: "235:235" }, // Band 19 Enabled
  { ident: "236:236" }, // Band 19 Frequency
  { ident: "237:237", inv: true }, // Band 19 Gain
  { ident: "240:240" }, // Band 19 Threshold
  { ident: "241:241" }, // Band 19 Q
  { ident: "242:242" }, // Band 19 Shape
  { ident: "243:243" }, // Band 19 Slope
  { ident: "244:244" }, // Band 19 Stereo Placement
  { ident: "246:246" }, // Band 19 Solo
  { ident: "247:247" }, // Band 20 Used
  { ident: "248:248" }, // Band 20 Enabled
  { ident: "249:249" }, // Band 20 Frequency
  { ident: "250:250", inv: true }, // Band 20 Gain
  { ident: "253:253" }, // Band 20 Threshold
  { ident: "254:254" }, // Band 20 Q
  { ident: "255:255" }, // Band 20 Shape
  { ident: "256:256" }, // Band 20 Slope
  { ident: "257:257" }, // Band 20 Stereo Placement
  { ident: "259:259" }, // Band 20 Solo
  { ident: "260:260" }, // Band 21 Used
  { ident: "261:261" }, // Band 21 Enabled
  { ident: "262:262" }, // Band 21 Frequency
  { ident: "263:263", inv: true }, // Band 21 Gain
  { ident: "266:266" }, // Band 21 Threshold
  { ident: "267:267" }, // Band 21 Q
  { ident: "268:268" }, // Band 21 Shape
  { ident: "269:269" }, // Band 21 Slope
  { ident: "270:270" }, // Band 21 Stereo Placement
  { ident: "272:272" }, // Band 21 Solo
  { ident: "273:273" }, // Band 22 Used
  { ident: "274:274" }, // Band 22 Enabled
  { ident: "275:275" }, // Band 22 Frequency
  { ident: "276:276", inv: true }, // Band 22 Gain
  { ident: "279:279" }, // Band 22 Threshold
  { ident: "280:280" }, // Band 22 Q
  { ident: "281:281" }, // Band 22 Shape
  { ident: "282:282" }, // Band 22 Slope
  { ident: "283:283" }, // Band 22 Stereo Placement
  { ident: "285:285" }, // Band 22 Solo
  { ident: "286:286" }, // Band 23 Used
  { ident: "287:287" }, // Band 23 Enabled
  { ident: "288:288" }, // Band 23 Frequency
  { ident: "289:289", inv: true }, // Band 23 Gain
  { ident: "292:292" }, // Band 23 Threshold
  { ident: "293:293" }, // Band 23 Q
  { ident: "294:294" }, // Band 23 Shape
  { ident: "295:295" }, // Band 23 Slope
  { ident: "296:296" }, // Band 23 Stereo Placement
  { ident: "298:298" }, // Band 23 Solo
  { ident: "299:299" }, // Band 24 Used
  { ident: "300:300" }, // Band 24 Enabled
  { ident: "301:301" }, // Band 24 Frequency
  { ident: "302:302", inv: true }, // Band 24 Gain
  { ident: "305:305" }, // Band 24 Threshold
  { ident: "306:306" }, // Band 24 Q
  { ident: "307:307" }, // Band 24 Shape
  { ident: "308:308" }, // Band 24 Slope
  { ident: "309:309" }, // Band 24 Stereo Placement
  { ident: "311:311" }, // Band 24 Solo
  { ident: "315:315", inv: true }, // Output Level
  { ident: "316:316", inv: true }, // Output Pan
  { ident: "317:317" }, // Output Pan Mode
  { ident: "318:318" }, // Bypass
  { ident: "519:bypass" }, // Bypass
];

function log(msg: string) {
  reaper.ShowConsoleMsg(msg);
  reaper.ShowConsoleMsg("\n");
}

function main() {
  const PARENT_NAME = "#EQ Emphasis";
  const CHILD_NAME = "#EQ Demphasis";

  const track = getSelectedTracks()[0];
  if (!track) error("no selected track");

  const { parent, child } = (() => {
    const allFx = track.getAllFx();
    let parent: FX | null = null;
    let child: FX | null = null;
    for (const fx of allFx) {
      if (fx.getName() === PARENT_NAME) {
        parent = fx;
      } else if (fx.getName() === CHILD_NAME) {
        child = fx;
      }
    }
    if (parent === null || child === null)
      error("failed to get parent and child fx");
    return { parent, child };
  })();

  log("Last touched FX params:");
  for (const param of fx.getParameters()) {
    log(`  ${encode(param.getIdentifier())} ${param.getName()}`);
  }
}

main();
