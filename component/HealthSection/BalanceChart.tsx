"use client";

type Activity = {
sleep: number;
work: number;
study: number;
exercise: number;
hobby: number;
other: number;
};

type Props = {
activity?: Activity | null;
};

export default function BalanceChart({
activity,
}: Props) {

const sleep =
activity?.sleep || 0;

const work =
activity?.work || 0;

const study =
activity?.study || 0;

const exercise =
activity?.exercise || 0;

const hobby =
activity?.hobby || 0;

const other =
activity?.other || 0;

const total =
sleep +
work +
study +
exercise +
hobby +
other;

const s =
total === 0
? 0
: (sleep / total) * 100;

const w =
total === 0
? 0
: (work / total) * 100;

const st =
total === 0
? 0
: (study / total) * 100;

const ex =
total === 0
? 0
: (exercise / total) * 100;

const h =
total === 0
? 0
: (hobby / total) * 100;

return (


<div
  style={{
    background:"#fff",
    borderRadius:"20px",
    padding:"24px",
  }}
>

  <h3>
    🥧 1日の生活バランス
  </h3>

  <div
    style={{
      width:"220px",
      height:"220px",
      borderRadius:"50%",
      margin:"30px auto",
      background:
        `conic-gradient(
          #60a5fa 0% ${s}%,
          #34d399 ${s}% ${s+w}%,
          #f59e0b ${s+w}% ${s+w+st}%,
          #ef4444 ${s+w+st}% ${s+w+st+ex}%,
          #8b5cf6 ${s+w+st+ex}% ${s+w+st+ex+h}%,
          #94a3b8 ${s+w+st+ex+h}% 100%
        )`,
    }}
  />

  <Legend
    color="#60a5fa"
    label="睡眠"
    value={sleep}
  />

  <Legend
    color="#34d399"
    label="仕事"
    value={work}
  />

  <Legend
    color="#f59e0b"
    label="勉強"
    value={study}
  />

  <Legend
    color="#ef4444"
    label="運動"
    value={exercise}
  />

  <Legend
    color="#8b5cf6"
    label="趣味"
    value={hobby}
  />

  <Legend
    color="#94a3b8"
    label="その他"
    value={other}
  />

</div>


);
}

function Legend({
color,
label,
value,
}: any) {

return (


<div
  style={{
    display:"flex",
    alignItems:"center",
    gap:"10px",
    marginBottom:"8px",
  }}
>

  <div
    style={{
      width:"14px",
      height:"14px",
      borderRadius:"50%",
      background:color,
    }}
  />

  <span>
    {label}
  </span>

  <span>
    {value}分
  </span>

</div>


);
}
