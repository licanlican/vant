import NumberKeyboard from '..';
import { mount, trigger } from '../../../test';

function clickKey(key) {
  trigger(key, 'touchstart');
  trigger(key, 'touchend');
}

test('click number key', () => {
  const wrapper = mount(NumberKeyboard, {
    props: {
      theme: 'custom',
      closeButtonText: 'close',
    },
  });

  clickKey(wrapper.findAll('.van-key').at(0));
  expect(wrapper.emitted('input')[0][0]).toEqual(1);

  wrapper.destroy();
});

test('click delete key', () => {
  const wrapper = mount(NumberKeyboard);

  clickKey(wrapper.findAll('.van-key').at(11));
  expect(wrapper.emitted('delete')).toBeTruthy();
});

test('click collapse key', () => {
  const wrapper = mount(NumberKeyboard);
  clickKey(wrapper.findAll('.van-key').at(9));
  expect(wrapper.emitted('input')).toBeFalsy();
  expect(wrapper.emitted('blur')).toBeFalsy();

  wrapper.setProps({ show: true });
  clickKey(wrapper.findAll('.van-key').at(9));
  expect(wrapper.emitted('blur')).toBeTruthy();
});

test('click close button', () => {
  const wrapper = mount(NumberKeyboard, {
    props: {
      theme: 'custom',
      closeButtonText: 'close',
    },
  });

  clickKey(wrapper.findAll('.van-key').at(12));
  expect(wrapper.emitted('close')).toBeTruthy();
});

test('listen to show/hide event when has transtion', () => {
  const wrapper = mount(NumberKeyboard);
  wrapper.vm.show = true;
  wrapper.trigger('animationend');
  wrapper.vm.show = false;
  wrapper.trigger('animationend');
  expect(wrapper.emitted('show')).toBeTruthy();
  expect(wrapper.emitted('hide')).toBeTruthy();
});

test('listen to show event when no transtion', () => {
  const wrapper = mount(NumberKeyboard, {
    props: {
      transition: false,
    },
  });
  wrapper.vm.show = true;
  wrapper.vm.show = false;
  expect(wrapper.emitted('show')).toBeTruthy();
  expect(wrapper.emitted('hide')).toBeTruthy();
});

test('render title', () => {
  const wrapper = mount(NumberKeyboard, {
    props: {
      title: 'Title',
      closeButtonText: 'Close',
    },
  });

  expect(wrapper.html()).toMatchSnapshot();
});

test('title-left slot', () => {
  const wrapper = mount(NumberKeyboard, {
    slots: {
      'title-left': () => 'Custom Title Left',
    },
  });

  expect(wrapper.html()).toMatchSnapshot();
});

test('extra-key prop', () => {
  const wrapper = mount(NumberKeyboard, {
    props: {
      extraKey: 'foo',
    },
  });

  expect(wrapper.html()).toMatchSnapshot();
});

test('extra-key slot', () => {
  const wrapper = mount(NumberKeyboard, {
    slots: {
      'extra-key': () => 'Custom Extra Key',
    },
  });

  expect(wrapper.html()).toMatchSnapshot();
});

test('hideOnClickOutside', () => {
  const wrapper = mount(NumberKeyboard, {
    props: {
      show: true,
    },
  });

  trigger(document.body, 'touchstart');
  expect(wrapper.emitted('blur')).toBeTruthy();
});

test('disable hideOnClickOutside', () => {
  const wrapper = mount(NumberKeyboard, {
    props: {
      show: true,
      hideOnClickOutside: false,
    },
  });

  trigger(document.body, 'touchstart');
  expect(wrapper.emitted('blur')).toBeFalsy();
});

test('focus on key', () => {
  const wrapper = mount(NumberKeyboard);

  const key = wrapper.find('.van-key');
  trigger(key, 'touchstart');
  expect(wrapper.html()).toMatchSnapshot();
  trigger(key, 'touchend');
  expect(wrapper.html()).toMatchSnapshot();
});

test('move and blur key', () => {
  const wrapper = mount(NumberKeyboard);

  const key = wrapper.find('.van-key');
  trigger(key, 'touchstart');
  expect(wrapper.html()).toMatchSnapshot();
  trigger(key, 'touchmove', 0, 0);
  expect(wrapper.html()).toMatchSnapshot();
  trigger(key, 'touchmove', 100, 0);
  expect(wrapper.html()).toMatchSnapshot();
  trigger(key, 'touchend');
  expect(wrapper.emitted('input')).toBeFalsy();
});

test('bind value', () => {
  const wrapper = mount(NumberKeyboard, {
    props: {
      value: '',
    },
    listeners: {
      'update:value': (value) => {
        wrapper.setProps({ value });
      },
    },
  });

  const keys = wrapper.findAll('.van-key');
  clickKey(keys.at(0));
  clickKey(keys.at(1));

  expect(wrapper.vm.value).toEqual('12');

  clickKey(keys.at(11));
  expect(wrapper.vm.value).toEqual('1');
});

test('maxlength', () => {
  const onInput = jest.fn();
  const wrapper = mount(NumberKeyboard, {
    props: {
      value: '',
      maxlength: 1,
    },
    listeners: {
      input: onInput,
      'update:value': (value) => {
        wrapper.setProps({ value });
      },
    },
  });

  const keys = wrapper.findAll('.van-key');
  clickKey(keys.at(0));
  clickKey(keys.at(1));

  expect(wrapper.vm.value).toEqual('1');
  expect(onInput).toHaveBeenCalledTimes(1);
});

test('show-delete-key prop', () => {
  const wrapper = mount(NumberKeyboard, {
    props: {
      showDeleteKey: true,
    },
  });

  expect(wrapper.contains('.van-key--delete')).toBeTruthy();

  wrapper.setData({ showDeleteKey: false });
  expect(wrapper.contains('.van-key--delete')).toBeFalsy();

  wrapper.setData({
    theme: 'custom',
    showDeleteKey: true,
  });
  expect(wrapper.contains('.van-key--delete')).toBeTruthy();

  wrapper.setData({ showDeleteKey: false });
  expect(wrapper.contains('.van-key--delete')).toBeFalsy();
});

test('close-button-loading prop', () => {
  const wrapper = mount(NumberKeyboard, {
    props: {
      show: true,
      theme: 'custom',
      closeButtonLoading: true,
    },
  });

  expect(wrapper.contains('.van-key__loading-icon')).toBeTruthy();
});
