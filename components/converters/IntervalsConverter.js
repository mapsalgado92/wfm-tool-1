import { useContext } from 'react'
import { DataContext } from '../../contexts/DataContextProvider';
import { dateToString, stringToDate } from '../../snippets/date-handling';



const IntervalsConverter = ({ raw, exportConverted }) => {

  const { setEntries } = useContext(DataContext)

  const handleConversion = () => {

    let dataRows = raw

    if (dataRows[0].length < 10) {
      console.log("Error converting!", data[0])
      return -1
    }

    let current = {
      agent: "",
      totals: false,
      date: ""
    }

    const _AGENT = 1
    const _MU = 2
    const _TOTALS = 2
    const _DATE = 2
    const _SCH_FROM = 2
    const _SCH_TO = 4
    const _SCH_DURATION = 6
    const _ACT_FROM = 7
    const _ACT_TO = 8
    const _ACT_DURATION = 10
    const _SCH_ACTIVITY = 12
    const _ACT_ACTIVITY = 15
    const _DESCRIPTION = 20
    const _T_SCH_TIME = 5
    const _T_ACT_TIME = 7
    const _T_MIN_IN = 9
    const _T_MIN_OUT = 11
    const _T_PERCENT = 13

    let header = ["ENTRY-TYPE", "AGENT", "DATE", "FROM", "TO", "DURATION", "ACTIVITY", "DESCRIPTION"]
    let totalsEntries = [["AGENT", "DATE", "ACTIVITY", "SCH TIME", "ACT TIME", "MIN IN", "MIN OUT", "ADH PERCENT"]]

    let entries = []
    let activities = []
    let dates = []
    let agents = []


    for (let i = 9; i < dataRows.length - 15; i++) {
      if (/Agent:/.test(dataRows[i][_AGENT])) {
        current.agent = dataRows[i][_AGENT].split(": ")[1]
        current.totals = false
        if (!agents.includes(current.agent)) {
          agents.push(current.agent)
        }
      }

      if (/MU:/.test(dataRows[i][_MU])) {
        break
      }

      if (/Date:/.test(dataRows[i][_DATE])) {
        current.date = dateToString(stringToDate(dataRows[i][_DATE].split(":")[1]))
        if (!dates.includes(current.date)) {
          dates.push(current.date)
        }
      }

      if (/Total for/.test(dataRows[i][_TOTALS])) {
        current.totals = true
      }

      if (/[0-9]+:[0-9]+/.test(dataRows[i][_SCH_FROM]) && dataRows[i][_SCH_ACTIVITY]) {
        entries.push(
          [
            "Scheduled",
            current.agent,
            current.date,
            dataRows[i][_SCH_FROM],
            dataRows[i][_SCH_TO],
            dataRows[i][_SCH_DURATION],
            dataRows[i][_SCH_ACTIVITY],
            "no data"
          ]
        )
        if (!activities.includes(dataRows[i][_SCH_ACTIVITY])) {
          activities.push(dataRows[i][_SCH_ACTIVITY])
        }
      }

      if (/[0-9]+:[0-9]+/.test(dataRows[i][_ACT_FROM]) && dataRows[i][_ACT_ACTIVITY]) {
        entries.push(
          [
            "Actual",
            current.agent,
            current.date,
            dataRows[i][_ACT_FROM],
            dataRows[i][_ACT_TO],
            dataRows[i][_ACT_DURATION],
            dataRows[i][_ACT_ACTIVITY],
            dataRows[i][_DESCRIPTION]
          ]
        )

        if (!activities.includes(dataRows[i][_ACT_ACTIVITY])) {
          activities.push(dataRows[i][_ACT_ACTIVITY])
        }
      }

      if (activities.includes(dataRows[i][_TOTALS]) || dataRows[i][_TOTALS] === "Total") {
        if (!current.totals && (dataRows[i][_T_MIN_IN] + dataRows[i][_T_MIN_OUT]) !== "00") {
          totalsEntries.push(
            [
              current.agent,
              current.date,
              dataRows[i][_TOTALS],
              dataRows[i][_T_SCH_TIME],
              dataRows[i][_T_ACT_TIME],
              dataRows[i][_T_MIN_IN],
              dataRows[i][_T_MIN_OUT],
              dataRows[i][_T_PERCENT],
            ]
          )
        }
      }
    }

    console.log(entries)
    console.log(dates)

    exportConverted({ header, entries })
    setEntries({ data: [header, ...entries], type: "intervals", dates, agents })
  }

  return (
    <button onClick={handleConversion} disabled={raw.length < 1} className="btn btn-outline-info m-2 text-nowrap">
      <span>Intervals</span>
    </button>
  )
}

export default IntervalsConverter
