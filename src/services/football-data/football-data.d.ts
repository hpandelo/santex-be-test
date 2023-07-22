export type Area = {
  id: number
  name: string
  code: string
  flag: string
}

export type Competition = {
  name: string
  code: string
  areaName: string
  area: Area
  teams: Team[]
}

type BasePerson = {
  name: string
  teamName: string
  dateOfBirth: string
  nationality: string
}

export type Coach = BasePerson & {}

export type Player = BasePerson & {
  position: string
}

export type Team = {
  id: number
  name: string
  tla: string
  shortName: string
  areaName: string
  address: string
  area?: Area
  coach: Coach
  squad: Player[]
}