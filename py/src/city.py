
from building import Building
from entity import CapturableEntity


class BasicCity(CapturableEntity):
    from gameplay_config import common_buildings as _common
    from gameplay_config import income_generator as _INCOME_GENERATOR
    from gameplay_config import income_levels as _INCOME_LEVELS
    def __init__(self, title, pos):
        super().__init__(title=title, pos=pos)

        self._buildings = {}
        self._to_build = None
        
        common_buildings = Building.create_buildings(self._common)
        for bd in common_buildings:
            self._buildings[bd.building_type] = bd

    @property
    def income(self):
        generator = self._buildings[self._INCOME_GENERATOR]
        if generator.current_level is None:
            return 0
        else:
            return self._INCOME_LEVELS[generator.current_level]
    
    def build(self):
        if self._to_build is not None:
            self._buildings[self._to_build].build()
            self._to_build = None

    def move_to(self, pos):
        pass

    def set_building_to_build(self, btype):
        if btype in self._buildings:
            self._to_build = btype
        else:
            raise ValueError

import unittest

class BasicCityTestCase(unittest.TestCase):
    from vector import Vector2
    def setUp(self):
        self.city_pos = self.Vector2()
        self.city_title = "Rome"

    def test_build(self):
        city = BasicCity(title=self.city_title, pos=self.city_pos)

        for t in Building.Types.__members__:
            with self.subTest(t=t, city=city):
                city.set_building_to_build(t)
                self.assertEqual(city._buildings[t].current_level, None)
                city.build()
                self.assertEqual(city._buildings[t].current_level, 0)
                self.assertTrue(city._to_build is None)

    def test_set_building_to_build(self):
        city = BasicCity(title=self.city_title, pos=self.city_pos)
        
        for t in Building.Types.__members__:
            with self.subTest(t=t, city=city):
                city.set_building_to_build(t)
                self.assertEqual(city._to_build, t)

        with self.assertRaises(ValueError):
            city.set_building_to_build("HYPERCUBE")

    def test_income(self):
        city = BasicCity(title=self.city_title, pos=self.city_pos)
        self.assertEqual(city.income, 0)

        for i in range(3):
            with self.subTest(city=city):
                city.set_building_to_build(BasicCity._INCOME_GENERATOR)
                city.build()

                self.assertEqual(city.income, BasicCity._INCOME_LEVELS[i])


if __name__ == '__main__':
    unittest.main()
