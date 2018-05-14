
from collections import namedtuple
from enum import Enum


class Building(object):
    Level = namedtuple("BuildingLevel", ["title", "price"])
    Types = Enum("BuildingTypes", "HALL BLACKSMITH FORT")

    # from gameplay_config import common_buildings as _common

    @staticmethod
    def create_buildings(bdict):
        res = []
        for type_ in bdict:
            levels = [Building.Level(t, p) for t, p in bdict[type_]]
            res.append(Building(building_type=type_, levels_list=levels))
        return res

    def __init__(self, building_type, levels_list, current_level=None):
        super().__init__()
        assert current_level is None or current_level < len(levels_list)
        assert self._is_valid_type(building_type)
        self._building_type = building_type
        self._current_level = current_level
        self._levels = levels_list

    @property
    def building_type(self):
        return self._building_type

    @property
    def current_level(self):
        return self._current_level
    
    @property
    def is_built(self):
        return self._current_level is not None

    @property
    def next_level(self):
        if self._current_level is None:
            return self._levels[0]
        if self._is_last_level():
            return None
        else:
            return self._levels[self._current_level + 1]

    @property
    def title(self):
        if self._current_level is not None:
            return self._levels[self._current_level].title
        else:
            return "N/A"

    def build(self):
        if self._current_level is None:
            self._current_level = 0
        elif not self._is_last_level():
            self._current_level += 1

    def _is_last_level(self):
        if self._current_level is None:
            return False
        else:
            return self._current_level == len(self._levels) - 1

    def _is_valid_type(self, t):
        return t in self.Types.__members__

if __name__ == '__main__':
    Building.create_common_buildings()
