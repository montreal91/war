
class Entity(object):
    _pk_counter = 0
    def __init__(self, title, pos):
        Entity._pk_counter += 1
        self._pk = Entity._pk_counter

        self._is_visible = True
        self._pos = pos
        self._title = str(title)

    @property
    def is_visible(self):
        return self._is_visible

    @is_visible.setter
    def is_visible(self, val):
        self._is_visible = bool(val)

    @property
    def pk(self):
        return self._pk

    @property
    def position(self):
        return self._pos.copy

    @property
    def title(self):
        return self._title

    def get_distance_to(self, entity):
        return abs(self._pos - entity._pos)

    def move_to(self, pos):
        self._pos = pos.copy


class CapturableEntity(Entity):
    def __init__(self, title, pos):
        super().__init__(title=title, pos=pos)

        self._faction = None

    @property
    def faction(self):
        return self._faction
    

    def capture_by(self, faction):
        self._faction = faction

    def disown(self):
        self._faction = None


import unittest
# import unittest.mock
from unittest.mock import Mock
from unittest.mock import sentinel

class CapturableEntityTestCase(unittest.TestCase):
    from vector import Vector2
    def test_properties(self):
        pos = self.Vector2(100, 550)

        entity = CapturableEntity(pos=pos, title=sentinel.string1)

        with self.subTest(entity=entity):
            self.assertEqual(entity.position, pos)
            self.assertEqual(entity.title, str(sentinel.string1))
            self.assertFalse(entity.position is pos.y)
            self.assertEqual(entity.pk, 1)

        entity2 = CapturableEntity(pos=self.Vector2(), title=sentinel.string2)
        with self.subTest(entity=entity,entity2=entity2):
            self.assertEqual(entity2.position, self.Vector2())
            self.assertNotEqual(entity.position, entity2.position)
            self.assertNotEqual(entity.title, entity2.title)
            self.assertEqual(entity2.pk, 2)


if __name__ == '__main__':
    unittest.main()